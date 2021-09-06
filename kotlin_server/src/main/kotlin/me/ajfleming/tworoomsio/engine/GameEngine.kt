package me.ajfleming.tworoomsio.engine

import com.corundumstudio.socketio.SocketIOServer
import me.ajfleming.tworoomsio.service.DeckBuilderService
import me.ajfleming.tworoomsio.storage.GameCache
import org.springframework.stereotype.Component

@Component
class GameEngine (
    val socketServer: SocketIOServer,
    val deckBuilderService: DeckBuilderService,
    val userManager: UserManager,
    val gameCache: GameCache
) {

}