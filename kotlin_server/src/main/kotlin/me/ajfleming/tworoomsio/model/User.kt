package me.ajfleming.tworoomsio.model

import com.corundumstudio.socketio.SocketIOClient
import java.util.*

class User constructor (
    val name: String,
    var client: SocketIOClient
) {
    val userToken = UUID.randomUUID().toString()
    val userSecret = UUID.randomUUID().toString()
    var connected = true;

    fun authenticate(userToken: String, userSecret: String): Boolean {
        return this.userToken == userToken && this.userSecret == userSecret
    }

    fun sendEvent(eventName: String, payload: Any) {
        client.sendEvent(eventName, payload)
    }

    fun isThisUser(user: User): Boolean {
        return userToken == user.userToken
    }

    fun disconnectPlayer() {
        this.connected = false;
    }

    fun reconnectUser(client: SocketIOClient) {
        this.client = client
        this.connected = true
    }
}