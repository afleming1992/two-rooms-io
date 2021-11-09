package me.ajfleming.tworoomsio.listeners

import com.corundumstudio.socketio.SocketIOClient
import com.corundumstudio.socketio.annotation.OnEvent
import me.ajfleming.tworoomsio.controller.PlayerActionController
import me.ajfleming.tworoomsio.socket.event.sharing.CardShareRequest
import me.ajfleming.tworoomsio.socket.event.sharing.ShareDecisionRequest
import org.springframework.stereotype.Component

@Component
class CardRequestListeners(
    val playerActionController : PlayerActionController
) : RequestListener() {

    @OnEvent("REQUEST_SHARE")
    fun onRequestShare(client: SocketIOClient, request: CardShareRequest) {
        playerActionController.requestShare(client, request);
    }

    @OnEvent("ACCEPT_SHARE")
    fun onAcceptShare(client: SocketIOClient, request: ShareDecisionRequest) {
        playerActionController.acceptShare(client, request.gameId, request.id)
    }

    @OnEvent("REJECT_SHARE")
    fun onRejectShare(client: SocketIOClient, request: ShareDecisionRequest) {
        playerActionController.rejectShare(client, request.gameId, request.id)
    }

    @OnEvent("PRIVATE_REVEAL")
    fun onPrivateReveal(client: SocketIOClient, request: CardShareRequest) {
        playerActionController.privateReveal(client, request)
    }
}