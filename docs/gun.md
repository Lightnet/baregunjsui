# Gun

 * https://github.com/amark/gun/wiki/How-to-Sync-Time
 * https://github.com/amark/gun/wiki/Timegraph


 .time( function(data, key, time) ) //Subscribes to all future events that occur on the Timegraph

 .time( function(data, key, time), num) // Subscribes to all future events that occur on the Timegraph and retrieve a specified number of old events

 .time( data ) //Pushes data to a Timegraph with it's time set to Gun.state()'s time