import { Injectable } from '@angular/core';
import {Subject, Observable, of, BehaviorSubject} from 'rxjs';
import {WebSocketService} from './websocket.service';
import {catchError, map, share} from 'rxjs/operators';

const DATA_URL = 'ws://localhost:1337';
// const DATA_URL = 'ws://smrtgraphdb-dev.ncats.nih.gov:1337';

@Injectable()
export class DataConnectionService {
  public messages: Subject<any> = new Subject<any>();
  public connected: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private messagesEmitter: any;
  constructor(private wsService: WebSocketService) {

    //  subscribe to websocket
    this.messagesEmitter  = <Subject<any>>this.wsService
      .connect(DATA_URL)
      .pipe(
      map((response: MessageEvent): string => {
       return response.data;
      }),
        catchError(this.handleError('messageEmitter', []))
      );

    this.messages = this.messagesEmitter.pipe(
      share()
    );
  this.connected.next(true);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
} //  end class DataService
