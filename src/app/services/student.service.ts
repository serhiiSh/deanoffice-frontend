import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StudentDegree} from '../models/StudentDegree';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class StudentService {
    private url = `${environment.apiUrl}/students`;

    constructor(private http: HttpClient) {
    }

    getStudentsByGroupId(groupId: number): Observable<StudentDegree[]> {
        const url = `${environment.apiUrl}/groups/${groupId}/students`;
        return this.http.get<StudentDegree[]>(url);
    }

    getInitialStudents(): Observable<StudentDegree[]> {
        return this.http.get<StudentDegree[]>(`${this.url}/degrees`);
    }

    getStudents(): Observable<StudentDegree[]> {
        return this.http.get<StudentDegree[]>(`${this.url}/degrees/more-detail`);
    }

    addStudentDegree(studentDegree): Observable<StudentDegree> {
        const params = !studentDegree.student.id
            ? {params: {new_student: 'true'}}
            : {};
        return this.http.post<StudentDegree>(`${this.url}/degrees`, studentDegree, params);
    }

    search(fullName: string = ''): Observable<StudentDegree[]> {
        console.log('search', fullName);
        const [surname = '', name = '', patronimic = ''] = fullName.split(' ');
        return this.http.get<StudentDegree[]>(`${this.url}/search`, {
            params: {
                surname,
                name,
                patronimic,
            }
        });
    }

}
