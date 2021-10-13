package me.ajfleming.tworoomsio.model

import com.corundumstudio.socketio.SocketIOClient
import java.util.*

class Player constructor (
    val name: String,
    var client: SocketIOClient
) {
    val id = UUID.randomUUID().toString()
    val secret = UUID.randomUUID().toString()
    var connected = true;

    fun authenticate(userToken: String, userSecret: String): Boolean {
        return this.id == userToken && this.secret == userSecret
    }

    fun sendEvent(eventName: String, payload: Any) {
        client.sendEvent(eventName, payload)
    }

    fun isThisUser(player: Player): Boolean {
        return id == player.id
    }

    fun disconnectPlayer() {
        this.connected = false;
    }

    fun reconnectUser(client: SocketIOClient) {
        this.client = client
        this.connected = true
    }
}