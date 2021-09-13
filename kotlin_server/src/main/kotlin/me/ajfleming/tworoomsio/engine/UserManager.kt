package me.ajfleming.tworoomsio.engine

import com.corundumstudio.socketio.SocketIOClient
import me.ajfleming.tworoomsio.model.Player
import org.springframework.stereotype.Component
import kotlin.collections.HashMap

@Component
class UserManager(
    private var connectedUsers: HashMap<String, Player> = HashMap(),
    private var disconnectedUsers: HashMap<String, Player> = HashMap()
) {
    fun createUser(client: SocketIOClient, name: String): Player {
        val user = Player(name, client)
        connectedUsers[user.userToken] = user
        return user;
    }

    fun getUser(client: SocketIOClient) : Player? {
        return connectedUsers[sessionId(client)]
    }

    fun reconnect(client: SocketIOClient, userToken: String, userSecret: String) : Player? {
        var user = disconnectedUsers[userToken]
        if (user == null) {
            user = findConnectedUserByUserToken(userToken)
            if (user != null) {
               user.client.disconnect()
            }
        }
        if(user != null && user.authenticate(userToken, userSecret)) {
            user.client = client
            disconnectedUsers.remove(userToken)
            connectedUsers[userToken] = user
        }
        return user
    }

    fun handleDisconnect(client: SocketIOClient) : Player? {
        val user = connectedUsers[sessionId(client)]
        if (user != null) {
            user.disconnectPlayer()
            disconnectedUsers[user.userToken] = user
        }
        return user
    }

    fun findConnectedUserByUserToken(userToken: String) : Player? {
        return connectedUsers[userToken]
    }

    private fun sessionId(client: SocketIOClient) : String {
        return client.sessionId.toString()
    }
}