import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Viewer } from '@react-pdf-viewer/core'; // install this library
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'; // install this library
import { Worker } from '@react-pdf-viewer/core';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import baseurl from "../Components/baseurl";
import { getUserData } from "../Auth";
import "./pcsubjectdetailsStyles.css";
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import OnHoverScrollContainer from "./../Components/CustomeScroll";
import pdfjsLib from 'pdfjs-dist';



const customStyles = {
    valueContainer: (base) => ({
        ...base,
        justifyContent: 'left',
    }),
    container: (base) => ({
        ...base,
        width: '80%',
        margin: 'auto'
    }),
    control: (base) => ({
        ...base,
        maxHeight: "50px",
        cursor: "pointer",
    }),
    option: (base, state) => ({
        ...base,
        color: state.isSelected ? "white" : "black",
        backgroundColor: state.isSelected ? "black" : "white",
        cursor: "pointer",
        borderRadius: 3,
        '&:hover': {
            backgroundColor: "grey",
            color: "white",
            borderRadius: 0,
        }
    })
};


const FacultySubjectdetails = () => {
    let token = "Bearer " + getUserData().token;
    let dept = getUserData().facultyDto.dept;
    const [facultySubject, setFacultySubject] = useState(JSON.parse(localStorage.getItem('facultysubject')) || []);

    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const [seq, setSeq] = useState([]);
    const [alldept, setAllDept] = useState([]);
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfFileError, setPdfFileError] = useState('');
    const [viewPdf, setViewPdf] = useState(null);
    const [pdfRequest,setPdfRequest] =useState({pdfFile:null,dduCode:null});
    const [selectedFile, setSelectedFile] = useState(null);


    useEffect(() => {
        axios.get(`${baseurl}/Faculty/getremainingsubsequence/${facultySubject.semester}`, { headers: { "Authorization": token } }, facultySubject.semester)
            .then((res) => {
                const arr = res.data;
                arr.push(facultySubject.subSequence);
                arr.sort((a, b) => a - b);
                setSeq(arr);
            })
            .catch((err) => {
                console.log(err);
            });

        axios.get(`${baseurl}/Faculty/getalldept`, { headers: { "Authorization": token } })
            .then((res) => {
                setAllDept(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);
    useEffect(() => {
        handlePdfFileView();
        // handlePdfInSubject();
    }, [pdfFile]);


    const semOptions = [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" },
        { value: "6", label: "6" },
        { value: "7", label: "7" },
        { value: "8", label: "8" },
    ];
    const subSequenceOptions = seq.map((s) => ({
        value: s,
        label: JSON.stringify(s)
    }));
    const deptOptions = alldept.map((d) => ({
        value: d,
        label: `${d.deptId} - ${d.deptName}`
    }));


    const fileType = ['application/pdf'];

    const handlePdfFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = async (event) => {
          const data = new Uint8Array(event.target.result);
          const pdfDoc = pdfjsLib.getDocument({ data });
          const numPages = pdfDoc.numPages;
          let base64String = '';
          for (let i = 1; i <= numPages; i++) {
            const page = await pdfDoc.getPage(i);
            const content = await page.getTextContent();
            base64String += btoa(content.items.map(item => item.str).join(''));
          }
          setSelectedFile(base64String);
        };
        reader.readAsArrayBuffer(file);
        setPdfFile(file);
      };

    // const handlePdfFileChange = (e) => {
    //     let selectedFile = e.target.files[0];
    //     if (selectedFile) {
    //         if (selectedFile && fileType.includes(selectedFile.type)) {
    //             let reader = new FileReader();
    //             reader.readAsArrayBuffer(selectedFile);
    //             reader.onloadend = (e) => {
    //                 const pdfBlob = new Blob([reader.result], { type: 'application/pdf' });
    //             setPdfFile(pdfBlob);
    //             setPdfFileError('');
    //                 // setPdfFile(e.target.result)
    //                 // setPdfFileError('');
    //             }
    //         }
    //         else {
    //             setPdfFile(null);
    //             setPdfFileError('Please select valid pdf file');
    //         }
    //     }
    //     else {
    //         console.log('select your file');
    //     }
    // }

    // const handlePdfFileChange = (e) => {
    //     setPdfFile(e.target.files[0]);
    //   };

    // const handlePdfInSubject=()=>{
    //     setFacultySubject({ ...facultySubject, subjectFile: pdfFile });
    // }


    const handlePdfFileView = () => {
        if (pdfFile !== null) {
            setViewPdf(pdfFile);
        }
        else {
            setViewPdf(null);
        }
    }

    const defaultsem = () => {
        return semOptions[semOptions.findIndex(option => option.label === JSON.stringify(facultySubject.semester))]
    }

    const defaultseq = () => {
        return subSequenceOptions[subSequenceOptions.findIndex(option => option.label === JSON.stringify(facultySubject.subSequence))]
    }

    const defaultdept = () => {
        return deptOptions[deptOptions.findIndex(option => option.value === facultySubject.dept)];
    }

    const formData=new FormData();
    useEffect(()=>{
        // setPdfRequest({...pdfRequest,pdfFile:pdfFile})
        formData.append('pdfFile',pdfFile);
    },[pdfFile])

    useEffect(()=>{
        // setPdfRequest({...pdfRequest,dduCode:facultySubject})
        formData.append('dduCode',facultySubject);
    },[facultySubject])

    const updatesubjectform = async (e) => {
        e.preventDefault();
        // const obj={pdfFile,facultySubject};
        
        
        // console.log(facultySubject)
        console.log(pdfFile)
        // console.log(JSON.stringify(facultySubject));
        // console.log("DDu code is")
        // console.log(facultySubject.dduCode)
        // const formData=new FormData();
        // formData.append('pdfFile',pdfFile);
        // formData.append('dduCode',facultySubject);
        // console.log("",formData.get('pdfFile'));


        const formData = new FormData();
    formData.append("file", selectedFile);
    
    // Append custom object as JSON data
    formData.append('dduCode', JSON.stringify(facultySubject.dduCode));
        
        const uploadres = await axios.post(`${baseurl}/Faculty/uploadsubjectfile`,formData, { headers: { "Content-Type":"multipart/form-data","Authorization": token } });

        toast.promise(
            uploadres,
            {
                pending: {
                    render() {
                        return "Please Wait!!"
                    },
                    icon: "✋",
                },
                success: {
                    render() {
                        return `Subject Details stored Successfully!!`
                    },
                    icon: "🚀",
                },
                error: {
                    render({ data }) {
                        console.log(data);
                        if (data.response.status === 400 || data.response.status === 404 || data.response.status === 401)
                            return data.response.data.status;
                        return 'Internal server error!!';
                    },
                    icon: "💥",
                }
            },
            {
                className: 'dark-toast',
                position: toast.POSITION.BOTTOM_RIGHT,
            }
        );
    }


    return (
        <div>
            <ToastContainer />
            <div className="subjectdetailcontainer">
                <OnHoverScrollContainer>
                    <form onSubmit={updatesubjectform} encType="multipart/form-data">
                        <h3 className="label margint gap3">Subject Name:</h3>
                        <input type="text" onChange={(e) => { setFacultySubject({ ...facultySubject, subjectName: e.target.value }) }} value={facultySubject.subjectName || ''} />
                        <h3 className="label margint gap3">Semester:</h3>
                        <Select options={semOptions} placeholder='Select semester' styles={customStyles}
                            value={defaultsem()}
                            onChange={(e) => { setFacultySubject({ ...facultySubject, semester: e.value }) }}
                            theme={(theme) => ({
                                ...theme,
                                colors: {
                                    ...theme.colors,
                                    primary: 'grey',
                                },
                            })}
                        />
                        <h3 className="label margint gap3">subSequence:</h3>
                        <Select options={subSequenceOptions} placeholder='Select sequence' styles={customStyles}
                            value={defaultseq()}
                            onChange={(e) => { setFacultySubject({ ...facultySubject, subSequence: e.value }) }}
                            theme={(theme) => ({
                                ...theme,
                                colors: {
                                    ...theme.colors,
                                    primary: 'grey',
                                },
                            })}
                        />
                        <h3 className="label margint">subjectType:</h3>
                        <input type="text" onChange={(e) => { setFacultySubject({ ...facultySubject, subjectType: e.target.value }) }} value={facultySubject.subjectType || ''} />
                        <h3 className="label margint">subjectTypeExplanation:</h3>
                        <input type="text" onChange={(e) => { setFacultySubject({ ...facultySubject, subjectTypeExplanation: e.target.value }) }} value={facultySubject.subjectTypeExplanation || ''} />
                        <h3 className="label margint">theoryMarks:</h3>
                        <input type="number" onChange={(e) => { setFacultySubject({ ...facultySubject, theoryMarks: e.target.value }) }} value={facultySubject.theoryMarks || ''} />
                        <h3 className="label margint">sessionalMarks:</h3>
                        <input type="number" onChange={(e) => { setFacultySubject({ ...facultySubject, sessionalMarks: e.target.value }) }} value={facultySubject.sessionalMarks || ''} />
                        <h3 className="label margint">termworkMarks:</h3>
                        <input type="number" onChange={(e) => { setFacultySubject({ ...facultySubject, termworkMarks: e.target.value }) }} value={facultySubject.termworkMarks || ''} />
                        <h3 className="label margint">practicalMarks:</h3>
                        <input type="number" onChange={(e) => { setFacultySubject({ ...facultySubject, practicalMarks: e.target.value }) }} value={facultySubject.practicalMarks || ''} />
                        <h3 className="label margint">totalMarks:</h3>
                        <input type="number" onChange={(e) => { setFacultySubject({ ...facultySubject, totalMarks: e.target.value }) }} value={facultySubject.totalMarks || ''} />
                        <h3 className="label margint">LectureHours:</h3>
                        <input type="number" onChange={(e) => { setFacultySubject({ ...facultySubject, lectureHours: e.target.value }) }} value={facultySubject.lectureHours || ''} />
                        <h3 className="label margint">tutorial:</h3>
                        <input type="number" onChange={(e) => { setFacultySubject({ ...facultySubject, tutorial: e.target.value }) }} value={facultySubject.tutorial || ''} />
                        <h3 className="label margint">PracticalHours:</h3>
                        <input type="number" onChange={(e) => { setFacultySubject({ ...facultySubject, practicalHours: e.target.value }) }} value={facultySubject.practicalHours || ''} />
                        <h3 className="label margint">totalHours:</h3>
                        <input type="number" onChange={(e) => { setFacultySubject({ ...facultySubject, totalHours: e.target.value }) }} value={facultySubject.totalHours || ''} />
                        <h3 className="label margint">lectureAndTheoryCredit:</h3>
                        <input type="number" onChange={(e) => { setFacultySubject({ ...facultySubject, lectureAndTheoryCredit: e.target.value }) }} value={facultySubject.lectureAndTheoryCredit || ''} />
                        <h3 className="label margint">practicalCredit:</h3>
                        <input type="number" onChange={(e) => { setFacultySubject({ ...facultySubject, practicalCredit: e.target.value }) }} value={facultySubject.practicalCredit || ''} />
                        <h3 className="label margint">totalCredit:</h3>
                        <input type="number" onChange={(e) => { setFacultySubject({ ...facultySubject, totalCredit: e.target.value }) }} value={facultySubject.totalCredit || ''} />
                        <h3 className="label margint">parentDept:</h3>
                        <Select options={deptOptions} placeholder='select parent dept' styles={customStyles}
                            value={defaultdept()}
                            onChange={(e) => { setFacultySubject({ ...facultySubject, parentDept: e.value }) }}
                            theme={(theme) => ({
                                ...theme,
                                colors: {
                                    ...theme.colors,
                                    primary: 'grey',
                                },
                            })}
                        />
                        <h3 className="label margint">extraInfo:</h3>
                        <input type="text" onChange={(e) => { setFacultySubject({ ...facultySubject, extraInfo: e.target.value }) }} value={facultySubject.extraInfo || ''} />
                        {/* <input type="file" accept=".pdf" onChange={handlePdfFileChange}/> */}
                        <input  type="file" accept='.pdf' className='form-control margint' onChange={handlePdfFileChange} />
                        {pdfFileError && <div className='error-msg'>{pdfFileError}</div>}
                        <br />
                        <button type="submit" className="SubmitButton coolBeans margint">Update</button>
                    </form>


                    {/* <h4>View PDF</h4>
                    <div className='pdf-container'>
                        {viewPdf && <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
                            <Viewer fileUrl={viewPdf} plugins={[defaultLayoutPluginInstance]} />
                        </Worker>}
                        {!viewPdf && <>No pdf file selected</>}
                    </div> */}
                </OnHoverScrollContainer>
            </div>
        </div >
    )
}

export default FacultySubjectdetails
