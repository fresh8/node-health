const { expect, assert } = require('chai')

const constants = require('../../../../lib/cluster/constants')
const makeClusterMock = require('../../../mocks/cluster')
const clusterMessageMock = require('../../../mocks/cluster-message')

describe('Cluster Message Adapter', () => {
  const GET_HEALTH = constants.EVENT_NAMES.MASTER_ASKING_HEALTH
  let mockForCluster

  before(() => {
    const CodependencyMock = require('../../../mocks/codependency')
    const Injector = require('../../../../lib/util/injector')
    const CopaceticStrategyFactory = require('../../../../lib/health-strategies/copacetic')

    mockForCluster = function mockForCluster (clusterMockConfig, clusterOptions, adapterOptions) {
      const strategy = CopaceticStrategyFactory(
        Injector(CodependencyMock({
          'cluster-messages': clusterMessageMock(makeClusterMock(clusterMockConfig), clusterOptions)
        }))
      )()
      strategy.adapter.init(adapterOptions)
      return strategy
    }
  })

  describe('checkHealth', () => {
    it('Has a checkHealth function', () => {
      const strategy = mockForCluster({
        isMaster: true,
        workers: []
      })

      assert.isDefined(strategy.adapter.checkHealth)
    })

    it('Returns a promise', () => {
      const strategy = mockForCluster({
        isMaster: true,
        workers: []
      })

      assert.isDefined(strategy.adapter.checkHealth)
      expect(strategy.adapter.checkHealth()).to.be.a('promise')
    })

    it('Throws if no worker information given', () => {
      // this is because cluster-message currently has no way of contacting a single worker, if no worker id were to be provided the message would essentially be replied to by all workers
      const strategy = mockForCluster({
        isMaster: true,
        workers: [ { noopFn () { } } ]
      })

      return new Promise((resolve, reject) => {
        strategy.adapter.checkHealth()
          .then(reject)
          .catch((e) => {
            try {
              expect(e.message).to.contain('Missing worker id')
            } catch (e) {
              return reject(e)
            }
            resolve()
          })
      })
    })

    it('Is able to request the health of a child process', () => {
      const strategy = mockForCluster({
        isMaster: true,
        workers: [
          {
            id: 1,
            [`on${GET_HEALTH}`] (data, notACallback) {
              notACallback({ isHealthy: true })
            }
          }
        ]
      })

      return strategy.adapter.checkHealth({ id: 1 })
        .then(res => expect(res.isHealthy).to.equal(true))
    })

    it('Is able to request the health of the correct worker amongst multiple', () => {
      const strategy = mockForCluster({
        isMaster: true,
        workers: [
          {
            id: 1,
            [`on${GET_HEALTH}`] (data, notACallback) {
              if (data.recipient !== 1) {
                return
              }
              notACallback({ name: 1, isHealthy: true })
            }
          },
          {
            id: 2,
            [`on${GET_HEALTH}`] (data, notACallback) {
              if (data.recipient !== 2) {
                return
              }
              notACallback({ name: 2, isHealthy: false })
            }
          }
        ]
      })

      return strategy.adapter.checkHealth({ id: 2 })
        .then((res) => {
          expect(res.isHealthy).to.equal(false)
          expect(res.name).to.equal(2)
        })
    })

    it('considers unhealthy on timeout', () => {
      const strategy = mockForCluster({
        isMaster: true,
        workers: [
          {
            id: 1,
            [`on${GET_HEALTH}`] () {
              return { isHealthy: true }
            }
          }
        ]
      }, { playDead: true }, { timeout: 500 })

      return new Promise((resolve, reject) => {
        strategy.adapter.checkHealth({ id: 1 })
          .then(reject)
          .catch((e) => {
            try {
              expect(e.message).to.contain('timed out')
            } catch (e) {
              return reject(e)
            }
            resolve()
          })
      })
    })
  })
})
