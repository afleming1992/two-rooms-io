package me.ajfleming.tworoomsio.listeners

import com.corundumstudio.socketio.SocketIOClient
import com.corundumstudio.socketio.annotation.OnEvent
import me.ajfleming.tworoomsio.controller.UserActionController
import me.ajfleming.tworoomsio.socket.event.game.JoinGameEvent
import org.springframework.stereotype.Component
import java.net.Socket

@Component
class HostEventListeners  (
    val userActionController: UserActionController
) : RequestListener() {

    @OnEvent("CREATE_GAME")
    fun onCreateGame(client: SocketIOClient, event: JoinGameEvent) {
        userActionController.createGame(client, event.name)
    }

    @OnEvent("JOIN_GAME")
    fun onJoinGame(client: SocketIOClient, event: JoinGameEvent) {
        userActionController.joinGame(client, event.name, event.joinGameCode)
    }
}