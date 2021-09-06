package me.ajfleming.tworoomsio.socket

import com.corundumstudio.socketio.SocketIOServer
import me.ajfleming.tworoomsio.listeners.RequestListener
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.ApplicationListener
import org.springframework.context.event.ContextClosedEvent
import org.springframework.stereotype.Component
import javax.annotation.PostConstruct

@Component
class SocketIOService @Autowired constructor(
    val server: SocketIOServer,
    val requestListeners: List<RequestListener>
) : ApplicationListener<ContextClosedEvent> {

    @PostConstruct
    fun init() {
        setupListeners();
        server.start();
    }

    fun setupListeners() {
        for (listener in requestListeners) {
            server.addListeners(listener);
        }
    }

    override fun onApplicationEvent(event: ContextClosedEvent) {
        server.stop()
    }
}