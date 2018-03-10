import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StudentGroup} from '../models/StudentGroup';

@Injectable()
export class StudentGroupService {

    constructor(private http: HttpClient) {
    }

    getGroupsByFaculty() {
        return this.http.get<StudentGroup>('/coursesforgroups/groups').toPromise();
    }

}
