package me.ajfleming.tworoomsio.config

import com.fasterxml.jackson.module.kotlin.jsonMapper
import com.fasterxml.jackson.module.kotlin.kotlinModule
import org.springframework.boot.SpringBootConfiguration
import javax.annotation.PostConstruct

@SpringBootConfiguration
class JacksonAutoConfiguration {
    @PostConstruct
    fun init() {
        jsonMapper {
            addModule(kotlinModule())
        }
    }
}