package me.ajfleming.tworoomsio.timer

import com.corundumstudio.socketio.SocketIOServer
import me.ajfleming.tworoomsio.model.Game
import java.util.*
import java.util.concurrent.*
import kotlin.concurrent.fixedRateTimer

class RoundTimer(
    val roundTimerName: String,
    var timer: Timer? = null,
    val onTick: TimerTrigger,
    val onEnd: TimerTrigger,
    var timerRunning: Boolean = false,
    var unitsLeft: Long
    ) {

    fun start() {
        if(unitsLeft > 0) {
            timerRunning = true;
            timer = fixedRateTimer(name = roundTimerName, initialDelay = 1000, period = 1000) {
                unitsLeft--
                onTickTrigger()
                if( unitsLeft < 1 ) {
                    onEndTrigger()
                    timer?.cancel()
                }
            }
        }
    }

    fun stop() {
        timer?.cancel()
        timerRunning = false
    }

    fun onTickTrigger() = onTick.trigger(this)
    fun onEndTrigger() = onEnd.trigger(this)

    companion object {
        fun setupTimer(initialTime: Long, game: Game, server: SocketIOServer): RoundTimer {
            return RoundTimer(
                roundTimerName = "${game.id}-timer",
                onTick = onTimerTick(server, game),
                onEnd = onTimerEnd(server,game),
                unitsLeft = initialTime
            )
        }

        fun onTimerTick(server: SocketIOServer, game: Game): TimerTrigger {
            return TimerTrigger {
                server.getRoomOperations(game.channelName).sendEvent("TIMER_UPDATE", it)
            }
        }

        fun onTimerEnd(server: SocketIOServer, game: Game): TimerTrigger {
            return TimerTrigger {
                server.getRoomOperations(game.channelName).sendEvent("TIMER_UPDATE", it)
            }
        }
    }
}