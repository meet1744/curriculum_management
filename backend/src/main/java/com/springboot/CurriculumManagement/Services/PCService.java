package com.springboot.CurriculumManagement.Services;

import com.springboot.CurriculumManagement.Entities.Department;
import com.springboot.CurriculumManagement.Entities.Faculty;
import com.springboot.CurriculumManagement.Entities.Subjects;

import java.util.List;

public interface PCService {
    Subjects addNewSubject(Subjects newSubject);

    List<Faculty> getAllFaculty(Department deptId);

    List<Integer> getRemainingSubSequence(int semesterSelected);
}