/*
 * © 2018 Match Group, LLC.
 */

package com.spos.data.socket.scarlet.websocket.streamadapter.rxjava2

import com.tinder.scarlet.Stream
import com.tinder.scarlet.StreamAdapter
import io.reactivex.rxjava3.core.Observable

class ObservableStreamAdapter<T : Any> : StreamAdapter<T, Observable<T>> {

    override fun adapt(stream: Stream<T>): Observable<T> = Observable.fromPublisher(stream)
}
