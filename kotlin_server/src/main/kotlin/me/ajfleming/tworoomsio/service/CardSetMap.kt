package me.ajfleming.tworoomsio.service

import me.ajfleming.tworoomsio.model.Card
import me.ajfleming.tworoomsio.model.CardInfo
import me.ajfleming.tworoomsio.model.CardSet

val coreSet = listOf(
    Card(CardInfo.PRESIDENT), Card(CardInfo.BOMBER),
)

val filler = listOf(
    Card(CardInfo.BLUE_TEAM), Card(CardInfo.RED_TEAM)
)

val gambler = listOf(
    Card(CardInfo.GAMBLER)
)

val cardSetMap: Map<CardSet, List<Card>> = mapOf(
    CardSet.CORE to coreSet,
    CardSet.FILLER to filler,
    CardSet.GAMBLER to gambler,
)

