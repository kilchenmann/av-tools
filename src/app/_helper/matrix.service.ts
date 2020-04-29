import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Video } from './index/index.component';

export interface Size {
    "width": number;
    "height": number;
}
export interface Profile {
    "formats": [string];
    "qualities": [string];
    "supports": [string];
}

export interface SipiImageInfo {
    "@context": string;
    "@id": string;
    "protocol": string;
    "width": number;
    "height": number;
    "sizes": [Size];
    "profile": (string | Profile)[];
}

@Injectable({
    providedIn: 'root'
})
export class MatrixService {

    constructor(
        private http: HttpClient
    ) { }

    /**
     * Returns sipi image information about the matrix file
     *
     * @param matrix url to matrix file
     */
    getMatrixInfo(matrix: string): Observable<SipiImageInfo> {
        return this.http.get<SipiImageInfo>(matrix)
            .pipe(
                catchError(this.handleError<any>('getMatrixInfo', {}))
            );
    }

    // getCurrentFrame(time: number, video: Video): string {
    //     this.getMatrixInfo(environment.iiifUrl + video.name + '_m_0.jpg/info.json').subscribe((res: SipiImageInfo) => {

    //     })
    //     return 'sipiurl';
    // }


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
            this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    /** Log a HeroService message with the MessageService */
    private log(message: string) {
        console.log(message);
        // this.messageService.add(`MatrixService: ${message}`);
    }

}
