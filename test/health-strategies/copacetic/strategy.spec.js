const { expect, assert } = require('chai')

const HealthStrategy = require('../../../lib/health-strategies/strategy')
const CopaceticStrategy = require('../../../lib/health-strategies/copacetic/strategy')

describe("Copacetic Strategy", () => {
  it("should export a function", () => {
    expect(CopaceticStrategy).to.be.a.Function
  })

  it("should produce a valid HealthStrategy", () => {
    expect(CopaceticStrategy()).to.be.an.instanceOf(HealthStrategy)
  })

  it("should implement cleanup", () => {
    const strategy = CopaceticStrategy()
    expect(strategy.cleanup).to.not.throw()
  })

  it("Succeeds on healthy dependency", () => {
    const strategy = CopaceticStrategy({
      getHealth: () => Promise.resolve({ isHealthy: true })
    })
    const health = strategy.check()
    expect(health).to.be.a.Promise
    return health
      .then((res) => {
        expect(res.isHealthy).to.equal(true)
      })
  })

  it("Reports unhealthy", () => { //
    const strategy = CopaceticStrategy({
      getHealth: () => Promise.resolve({ isHealthy: false })
    })
    return strategy.check()
      .then((res) => {
        expect(res.isHealthy).to.equal(false)
      })
  })

  describe("areYouOk", () => {
    const strategy = CopaceticStrategy({
      getHealth: () => Promise.resolve({ isHealthy: false })
    })

    it("should be defined", () => {
      assert.isDefined(strategy.areYouOk)
      expect(strategy.areYouOk).to.be.a.Function
    })

    it("should report health correctly", () => {
      expect(strategy.areYouOk({isHealthy: false})).to.equal(false)
      expect(strategy.areYouOk({isHealthy: true})).to.equal(true)
    })
  })
  //TODO test it considers unhealthy on timeout

  describe("Health Summary", () => {
    const strategy = CopaceticStrategy({
      getHealth: () => Promise.resolve({ isHealthy: false })
    })

    it("should be defined", () => {
      assert.isDefined(strategy.improveSummary)
      expect(strategy.improveSummary).to.be.a.Function
    })

    it("enhances the health summary with dependencies status", () => {
      const baseSummary = { healthy: true }
      const checkResult = { dependencies: [ { name: 'database' }] }
      strategy.improveSummary(baseSummary, checkResult)
      assert.isDefined(baseSummary.dependencies)
      expect(baseSummary.dependencies).to.deep.equal(checkResult.dependencies)
    })
  })
})
