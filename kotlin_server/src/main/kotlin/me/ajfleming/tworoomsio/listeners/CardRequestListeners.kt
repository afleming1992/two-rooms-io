package me.ajfleming.tworoomsio.listeners

import com.corundumstudio.socketio.SocketIOClient
import com.corundumstudio.socketio.annotation.OnEvent
import me.ajfleming.tworoomsio.controller.UserActionController
import me.ajfleming.tworoomsio.socket.event.sharing.CardShareRequest
import me.ajfleming.tworoomsio.socket.event.sharing.ShareDecisionRequest
import org.springframework.stereotype.Component

@Component
class CardRequestListeners(
    val userActionController : UserActionController
) : RequestListener() {

    @OnEvent("REQUEST_SHARE")
    fun onRequestShare(client: SocketIOClient, request: CardShareRequest) {
        userActionController
    }

    @OnEvent("ACCEPT_SHARE")
    fun onAcceptShare(client: SocketIOClient, request: ShareDecisionRequest) {

    }

    @OnEvent("REJECT_SHARE")
    fun onRejectShare(client: SocketIOClient, request: ShareDecisionRequest) {

    }

    @OnEvent("PRIVATE_REVEAL")
    fun onPrivateReveal(client: SocketIOClient, request: CardShareRequest) {

    }
}