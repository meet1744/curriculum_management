package com.springboot.CurriculumManagement.Payloads;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.springboot.CurriculumManagement.Entities.Subjects;

import java.util.List;

public class FacultyDto {
    private String facultyId;
    private String facultyName;
    private String password;
    private String emailId;
    private List<Subjects> subjectsList;

    public String getFacultyId() {
        return facultyId;
    }

    public void setFacultyId(String facultyId) {
        this.facultyId = facultyId;
    }

    public String getFacultyName() {
        return facultyName;
    }

    public void setFacultyName(String facultyName) {
        this.facultyName = facultyName;
    }

    @JsonIgnore
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmailId() {
        return emailId;
    }

    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }

    public List<Subjects> getSubjectsList() {
        return subjectsList;
    }

    public void setSubjectsList(List<Subjects> subjectsList) {
        this.subjectsList = subjectsList;
    }
}