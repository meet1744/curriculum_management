package com.springboot.CurriculumManagement.Repository;

import com.springboot.CurriculumManagement.Entities.Faculty;
import com.springboot.CurriculumManagement.Entities.Subjects;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


public interface SubjectsRepository extends JpaRepository<Subjects,String> {

//    Optional<Subjects> findBySubjectsId(String id);
    @Query(value = "select subSequence from Subjects where semester=?1")
    List<Integer> findExistingSubSequence(int semesterSelected);
}
