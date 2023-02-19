package com.springboot.CurriculumManagement.Controller;

import com.springboot.CurriculumManagement.Entities.Faculty;
import com.springboot.CurriculumManagement.Services.HODService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class HODController {

    @Autowired
    private HODService hodService;
    @PostMapping("/faculty")
    public Faculty addNewFaculty(@RequestBody Faculty faculty){

        return this.hodService.addNewFaculty(faculty);
    }
    @GetMapping("/faculty")
    public List<Faculty> getAllFaculty(){
        return this.hodService.getAllFaculty();
    }

    @DeleteMapping("/faculty/{facultyId}")
    public ResponseEntity<HttpStatus> deleteFaculty(@PathVariable String facultyId){
        try {
            this.hodService.deleteFaculty(facultyId);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/programcoordinator")
    public void appointProgramCoordinator(){
        hodService.appointProgramCoordinator();
        //returns error if already exists using custom http status code
    }






}