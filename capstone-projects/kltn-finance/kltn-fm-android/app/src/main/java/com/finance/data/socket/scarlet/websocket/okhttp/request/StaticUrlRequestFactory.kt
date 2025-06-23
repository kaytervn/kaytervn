/*
 * © 2018 Match Group, LLC.
 */

package com.spos.data.socket.scarlet.websocket.okhttp.request

import com.spos.data.socket.scarlet.websocket.okhttp.request.RequestFactory
import okhttp3.Request

/**
 * A [RequestFactory] that creates requests with a static URL.
 */
internal class StaticUrlRequestFactory(
    private val url: String
) : RequestFactory {

    override fun createRequest(): Request = Request.Builder()
        .url(url)
        .build()
}
