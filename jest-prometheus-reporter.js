// jest-prometheus-reporter.js
const promClient = require('prom-client');
const express = require('express');

class PrometheusReporter {
  constructor(globalConfig, options) {
    this.globalConfig = globalConfig;
    this.options = options;
    
    // Registre Prometheus
    this.register = new promClient.Registry();
    
    // Métriques
    this.testDuration = new promClient.Histogram({
      name: 'jest_test_duration_seconds',
      help: 'Duration of test execution',
      labelNames: ['test_suite', 'test_name', 'status'],
      registers: [this.register]
    });
    
    this.testsTotal = new promClient.Counter({
      name: 'jest_tests_total',
      help: 'Total number of tests',
      labelNames: ['status', 'test_suite'],
      registers: [this.register]
    });
    
    this.testSuiteDuration = new promClient.Gauge({
      name: 'jest_test_suite_duration_seconds',
      help: 'Test suite execution duration',
      labelNames: ['test_suite'],
      registers: [this.register]
    });

    // Serveur HTTP pour /metrics
    this.startMetricsServer();
  }

  startMetricsServer() {
    const app = express();
    const port = process.env.PORT || 9090;

    app.get('/metrics', async (req, res) => {
      res.set('Content-Type', this.register.contentType);
      res.end(await this.register.metrics());
    });

    app.listen(port, () => {
      console.log(`Metrics server listening on port ${port}`);
    });
  }

  onTestResult(test, testResult) {
    const suiteName = testResult.testFilePath.split('/').pop();
    
    // Durée totale de la suite
    this.testSuiteDuration.set(
      { test_suite: suiteName },
      testResult.perfStats.runtime / 1000
    );

    // Résultats individuels
    testResult.testResults.forEach(result => {
      const status = result.status;
      const duration = result.duration / 1000;

      this.testDuration.observe(
        {
          test_suite: suiteName,
          test_name: result.title,
          status: status
        },
        duration
      );

      this.testsTotal.inc({
        status: status,
        test_suite: suiteName
      });
    });
  }

  onRunComplete() {
    console.log('Test run complete, metrics available at /metrics');
  }
}

module.exports = PrometheusReporter;