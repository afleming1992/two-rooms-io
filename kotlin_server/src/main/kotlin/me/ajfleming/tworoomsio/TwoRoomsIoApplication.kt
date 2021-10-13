package me.ajfleming.tworoomsio

import com.corundumstudio.socketio.Configuration
import com.corundumstudio.socketio.SocketConfig
import com.corundumstudio.socketio.SocketIOServer
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean

@SpringBootApplication
class TwoRoomsIoApplication {
    @Bean
    fun socketIoConfig(): Configuration {
        val config = Configuration()
        config.port = 3001

        val socketConfig = SocketConfig()
        socketConfig.isReuseAddress = true

        config.socketConfig = socketConfig
        return config;
    }

    @Bean
    fun server(config: Configuration): SocketIOServer {
        return SocketIOServer(config)
    }
}

fun main(args: Array<String>) {
    runApplication<TwoRoomsIoApplication>(*args)
}

