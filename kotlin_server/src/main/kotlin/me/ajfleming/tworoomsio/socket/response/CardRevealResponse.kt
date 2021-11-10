package me.ajfleming.tworoomsio.socket.response

import me.ajfleming.tworoomsio.model.Card
import me.ajfleming.tworoomsio.model.Player
import me.ajfleming.tworoomsio.model.Team
import me.ajfleming.tworoomsio.socket.event.sharing.CardShareType

class CardRevealResponse(
    val isReveal: Boolean,
    val requestId: String? = null,
    val userToken: String,
    var team: Team? = null,
    var role: Card? = null,
    val type: CardShareType
) {
    companion object {
        fun roleShare(requestId: String, player: Player, role: Card): CardRevealResponse {
            return CardRevealResponse(
                isReveal = false,
                requestId = requestId,
                userToken = player.id,
                role = role,
                team = role.team,
                type = CardShareType.ROLE
            )
        }

        fun roleReveal(player: Player, role: Card): CardRevealResponse {
            return CardRevealResponse(
                isReveal = true,
                userToken = player.id,
                role = role,
                team = role.team,
                type = CardShareType.ROLE
            )
        }

        fun colourShare(requestId: String, player: Player, role: Card): CardRevealResponse {
            return CardRevealResponse(
                isReveal = false,
                userToken = player.id,
                team = role.team,
                type = CardShareType.COLOUR
            )
        }

        fun colourReveal(player: Player, role: Card): CardRevealResponse {
            return CardRevealResponse(
                isReveal = true,
                userToken = player.id,
                team = role.team,
                type = CardShareType.COLOUR
            )
        }
    }
}