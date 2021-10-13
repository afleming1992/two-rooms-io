package me.ajfleming.tworoomsio.socket.response

class Response (
    val success: Boolean,
    val message: String? = null
) {
    companion object {
        fun success(message: String?): Response {
            return Response(true, message)
        }

        fun error(message: String?): Response {
            return Response(false, message)
        }
    }
}