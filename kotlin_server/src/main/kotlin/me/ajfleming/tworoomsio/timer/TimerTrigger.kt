package me.ajfleming.tworoomsio.timer

fun interface TimerTrigger {
    fun trigger(timer: RoundTimer)
}