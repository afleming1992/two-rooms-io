package me.ajfleming.tworoomsio.model

enum class CardInfo(
    val cardKey: CardKey,
    val title: String,
    val subtitle: String,
    val howToWin: String,
    val cardImage: String,
    val team: Team
) {
    PRESIDENT(
        CardKey.PRESIDENT,
        "President",
        "Avoid the Bomber",
        "You are a primary character. The blue team wins if you do not gain the 'dead' condition",
        "president_blue", Team.BLUE),
    BOMBER(
        CardKey.BOMBER,
        "Bomber",
        "Be with the President",
        "You are a primary character. Everyone in the same room as you at the end of the game dies! The Red Team wins if the president dies!",
        "bomber_red", Team.RED),
    GAMBLER(
        CardKey.GAMBLER,
        "Gambler",
        "Guess if Red, Blue or Neither team won",
        "At the end of the last round, you will publically announce which team you think won the game. You only win if you are correct",
        "gambler", Team.GREY),
    BLUE_TEAM(
        CardKey.BLUE_TEAM,
        "Blue Team",
        "Keep the President away from the Bomber",
        "You are on the blue team. You win if the president doesn't die",
        "blue", Team.BLUE),
    RED_TEAM(
        CardKey.RED_TEAM,
        "Red Team",
        "Get the Bomber to be with the President",
        "You are on the red team. You win if the president dies!", "red",
        Team.RED)
}