package me.ajfleming.tworoomsio.model

class Card (
    cardInfo: CardInfo
) {
    val cardKey = cardInfo.cardKey
    val title = cardInfo.title
    val subtitle = cardInfo.subtitle
    val howToWin = cardInfo.howToWin
    val cardImage = cardInfo.cardImage
    val team = cardInfo.team
}