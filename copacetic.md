<a name="Copacetic"></a>

## Copacetic ⇐ <code>EventEmitter</code>
**Kind**: global class  
**Extends**: <code>EventEmitter</code>  

* [Copacetic](#Copacetic) ⇐ <code>EventEmitter</code>
    * [new Copacetic([name])](#new_Copacetic_new)
    * [.isHealthy](#Copacetic+isHealthy) ⇒ <code>Boolean</code>
    * [.healthInfo](#Copacetic+healthInfo) ⇒ <code>Array.&lt;DependencyHealth&gt;</code>
    * [.getDependency(dependency)](#Copacetic+getDependency) ⇒ <code>Dependency</code>
    * [.isDependencyRegistered(dependency)](#Copacetic+isDependencyRegistered) ⇒ <code>Boolean</code>
    * [.registerDependency(opts)](#Copacetic+registerDependency) ⇒ [<code>Copacetic</code>](#Copacetic)
    * [.deregisterDependency(name)](#Copacetic+deregisterDependency) ⇒ [<code>Copacetic</code>](#Copacetic)
    * [.pollAll([interval], [parallel], [schedule])](#Copacetic+pollAll) ⇒ [<code>Copacetic</code>](#Copacetic)
    * [.poll([dependencies], [interval], [parallel], [schedule])](#Copacetic+poll) ⇒ [<code>Copacetic</code>](#Copacetic)
    * [.stop()](#Copacetic+stop)
    * [.checkAll([parallel])](#Copacetic+checkAll) ⇒ [<code>Copacetic</code>](#Copacetic)
    * [.check([name], [dependencies], [retries], [parallel])](#Copacetic+check) ⇒ [<code>Copacetic</code>](#Copacetic)
    * [._checkOne(name)](#Copacetic+_checkOne) ⇒ <code>Promise</code>
    * [._checkMany(dependencies, parallel)](#Copacetic+_checkMany) ⇒ <code>Promise</code>
    * ["healthy"](#Copacetic+event_healthy)
    * ["unhealthy"](#Copacetic+event_unhealthy)
    * ["health"](#Copacetic+event_health)

<a name="new_Copacetic_new"></a>

### new Copacetic([name])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [name] | <code>String</code> | <code>&#x27;&#x27;</code> | The name of your service |

<a name="Copacetic+isHealthy"></a>

### copacetic.isHealthy ⇒ <code>Boolean</code>
**Kind**: instance property of [<code>Copacetic</code>](#Copacetic)  
**Returns**: <code>Boolean</code> - Copacetic is healthy when all hard dependencies are healthy  
<a name="Copacetic+healthInfo"></a>

### copacetic.healthInfo ⇒ <code>Array.&lt;DependencyHealth&gt;</code>
**Kind**: instance property of [<code>Copacetic</code>](#Copacetic)  
**Returns**: <code>Array.&lt;DependencyHealth&gt;</code> - Health information on all dependencies  
<a name="Copacetic+getDependency"></a>

### copacetic.getDependency(dependency) ⇒ <code>Dependency</code>
**Kind**: instance method of [<code>Copacetic</code>](#Copacetic)  

| Param | Type |
| --- | --- |
| dependency | <code>Dependency</code> \| <code>String</code> | 

<a name="Copacetic+isDependencyRegistered"></a>

### copacetic.isDependencyRegistered(dependency) ⇒ <code>Boolean</code>
**Kind**: instance method of [<code>Copacetic</code>](#Copacetic)  
**Returns**: <code>Boolean</code> - Whether the dependency has been registered  

| Param | Type |
| --- | --- |
| dependency | <code>Dependency</code> \| <code>String</code> | 

<a name="Copacetic+registerDependency"></a>

### copacetic.registerDependency(opts) ⇒ [<code>Copacetic</code>](#Copacetic)
Adds a dependency to a Copacetic instance

**Kind**: instance method of [<code>Copacetic</code>](#Copacetic)  

| Param | Type | Description |
| --- | --- | --- |
| opts | <code>Object</code> | The configuration for a dependency |

<a name="Copacetic+deregisterDependency"></a>

### copacetic.deregisterDependency(name) ⇒ [<code>Copacetic</code>](#Copacetic)
Removes a dependency from a Copacetic instance

**Kind**: instance method of [<code>Copacetic</code>](#Copacetic)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name used to identify a dependency |

<a name="Copacetic+pollAll"></a>

### copacetic.pollAll([interval], [parallel], [schedule]) ⇒ [<code>Copacetic</code>](#Copacetic)
Polls the health of all registered dependencies

**Kind**: instance method of [<code>Copacetic</code>](#Copacetic)  

| Param | Type | Default |
| --- | --- | --- |
| [interval] | <code>String</code> | <code>&#x27;5 seconds&#x27;</code> | 
| [parallel] | <code>Boolean</code> | <code>true</code> | 
| [schedule] | <code>String</code> | <code>&#x27;start&#x27;</code> | 

<a name="Copacetic+poll"></a>

### copacetic.poll([dependencies], [interval], [parallel], [schedule]) ⇒ [<code>Copacetic</code>](#Copacetic)
Polls the health of a set of dependencies

**Kind**: instance method of [<code>Copacetic</code>](#Copacetic)  
**Emits**: [<code>health</code>](#Copacetic+event_health)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [dependencies] | <code>Array.&lt;Object&gt;</code> |  | An explicit set of dependencies to be polled |
| [interval] | <code>String</code> | <code>&#x27;5 seconds&#x27;</code> |  |
| [parallel] | <code>Boolean</code> | <code>true</code> | Kick of health checks in parallel or series |
| [schedule] | <code>String</code> | <code>&#x27;start&#x27;</code> | Schedule the next check to start (interval - ms) | ms |

**Example**  
```js
copacetic.poll({
  dependencies: [
    { name: 'my-dep' },
    { name: 'my-other-dep', retries: 2 }
  ],
  schedule: 'end',
  interval: '1 minute 30 seconds'
})
.on('health', (serviceHealth) => {
  // Do something with the result
  // [{ name: String, health: Boolean, level: HARD/SOFT, lastCheck: Date }]
})
```
<a name="Copacetic+stop"></a>

### copacetic.stop()
stops polling registered dependencies

**Kind**: instance method of [<code>Copacetic</code>](#Copacetic)  
<a name="Copacetic+checkAll"></a>

### copacetic.checkAll([parallel]) ⇒ [<code>Copacetic</code>](#Copacetic)
Checks the health of all registered dependencies

**Kind**: instance method of [<code>Copacetic</code>](#Copacetic)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [parallel] | <code>Boolean</code> | <code>true</code> | Kick of health checks in parallel or series |

<a name="Copacetic+check"></a>

### copacetic.check([name], [dependencies], [retries], [parallel]) ⇒ [<code>Copacetic</code>](#Copacetic)
Checks the health of a set, or single dependency

**Kind**: instance method of [<code>Copacetic</code>](#Copacetic)  
**Emits**: [<code>health</code>](#Copacetic+event_health), [<code>healthy</code>](#Copacetic+event_healthy), [<code>unhealthy</code>](#Copacetic+event_unhealthy)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [name] | <code>String</code> |  | The identifier of a single dependency to be checked |
| [dependencies] | <code>Array.&lt;Object&gt;</code> |  | An explicit set of dependencies to be checked |
| [retries] | <code>Integer</code> | <code>1</code> | How many times should a dependency be checked, until it is deemed unhealthy |
| [parallel] | <code>Boolean</code> | <code>true</code> | Kick of health checks in parallel or series |

**Example**  
```js
copacetic.check({ name: 'my-dependency' })
```
**Example**  
```js
copacetic.check({ name: 'my-dependency', retries: 5 })
.on('healthy', serviceHealth => { // Do stuff })
.on('unhealthy', serviceHealth => { // Handle degraded state })
```
**Example**  
```js
copacetic.check({ dependencies: [
  { name: 'my-dep' },
  { name: 'my-other-dep', retries: 2 }
] })
.on('health', (servicesHealth) => {
  // Do something with the result
  // [{ name: String, health: Boolean, level: HARD/SOFT, lastCheck: Date }]
})
```
<a name="Copacetic+_checkOne"></a>

### copacetic._checkOne(name) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>Copacetic</code>](#Copacetic)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name used to identify a dependency |

<a name="Copacetic+_checkMany"></a>

### copacetic._checkMany(dependencies, parallel) ⇒ <code>Promise</code>
Checks an array of dependencies in parallel or sequantially

**Kind**: instance method of [<code>Copacetic</code>](#Copacetic)  

| Param | Type |
| --- | --- |
| dependencies | <code>Array.&lt;Dependency&gt;</code> | 
| parallel | <code>Boolean</code> | 

<a name="Copacetic+event_healthy"></a>

### "healthy"
Health information on a single dependency

**Kind**: event emitted by [<code>Copacetic</code>](#Copacetic)  
<a name="Copacetic+event_unhealthy"></a>

### "unhealthy"
Health information on a single dependency

**Kind**: event emitted by [<code>Copacetic</code>](#Copacetic)  
<a name="Copacetic+event_health"></a>

### "health"
Health information on a set of dependencies

**Kind**: event emitted by [<code>Copacetic</code>](#Copacetic)  