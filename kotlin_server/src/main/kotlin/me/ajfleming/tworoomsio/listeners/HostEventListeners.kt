package me.ajfleming.tworoomsio.listeners

import com.corundumstudio.socketio.SocketIOClient
import com.corundumstudio.socketio.annotation.OnEvent
import me.ajfleming.tworoomsio.controller.HostActionController
import me.ajfleming.tworoomsio.controller.PlayerActionController
import me.ajfleming.tworoomsio.socket.event.game.GameIdentityPayload
import me.ajfleming.tworoomsio.socket.event.game.JoinGameEvent
import me.ajfleming.tworoomsio.socket.event.game.RevealPlayerAssignmentEvent
import org.springframework.stereotype.Component

@Component
class HostEventListeners  (
    val hostActionController: HostActionController
) : RequestListener() {

    @OnEvent("CREATE_GAME")
    fun onCreateGame(client: SocketIOClient, event: JoinGameEvent) {
        hostActionController.createGame(client, event.name)
    }

    @OnEvent("NEXT_ROUND")
    fun onNextRound(client: SocketIOClient, event: GameIdentityPayload) {
        hostActionController.startNextRound(client, event.gameId)
    }

    @OnEvent("START_TIMER")
    fun onStartTimer(client: SocketIOClient, event: GameIdentityPayload) {
        hostActionController.startGameTimer(client, event.gameId)
    }

    @OnEvent("PAUSE_TIMER")
    fun onPauseTimer(client: SocketIOClient, event: GameIdentityPayload) {
        hostActionController.pauseGameTimer(client, event.gameId)
    }

    @OnEvent("RESTART_TIMER")
    fun onRestartTimer(client: SocketIOClient, event: GameIdentityPayload) {
        hostActionController.restartGameTimer(client, event.gameId)
    }

    @OnEvent("REVEAL_CARD_ASSIGNMENT")
    fun onRevealCardAssignment(client: SocketIOClient, event: RevealPlayerAssignmentEvent) {
        hostActionController.revealPlayerAssignment(client, event.gameId, event.card)
    }
}