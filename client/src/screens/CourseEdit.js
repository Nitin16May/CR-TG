import React, { useState, useEffect } from 'react';
import '../stylesheets/Editcreatecourse.css';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export default function CourseEdit() {
	const location = useLocation();
	let navigate = useNavigate();
	const [creds, setCreds] = useState({
		name: '',
		courseId: '',
		batch: '',
		credits: '',
		seats: '',
		courseType: '',
	});
	const [selectedFaculty, setSelectedFaculty] = useState('');
	const [facultyList, setFacultyList] = useState([]);
	const [data, setdata] = useState({});
	const [data1, setdata1] = useState({});

	const handleChange = event => {
		const { name, value } = event.target;
		setCreds({ ...creds, [name]: value });
	};

	const handleFacultyChange = event => {
		setSelectedFaculty(event.target.value);
	};

	const addFaculty = () => {
		if (selectedFaculty !== '' && !facultyList.includes(selectedFaculty)) {
			setFacultyList([...facultyList, selectedFaculty]);
			setSelectedFaculty('');
		} else {
			alert('Faculty already added or not selected');
		}
	};

	const removeFaculty = facultyToRemove => {
		const updatedFacultyList = facultyList.filter(faculty => faculty !== facultyToRemove);
		setFacultyList(updatedFacultyList);
	};
	useEffect(() => {
		async function authorize() {
			const authToken = localStorage.getItem('authToken');
			if (authToken) {
				try {
					const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/extractUserType`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ authToken: localStorage.getItem('authToken') }),
					});

					const json = await response.json();

					if (json.usertype === 'Faculty') {
						navigate('/alfaculty');
					}
					if (json.usertype === 'Student') {
						navigate('/alstudent');
					}
				} catch (error) {
					console.error('Error fetching data:', error);
				}
			}
		}

		async function fetchData() {
			try {
				const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getFacultyList`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ authToken: localStorage.getItem('authToken') }),
				});

				const json = await response.json();

				if (!json.success) {
					alert('I tried my best');
				} else {
					await setdata(json.data);
				}

				const response1 = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getCourseData`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ id: location.state.courseid }),
				});

				const json1 = await response1.json();

				if (!json1.success) {
					alert('I tried my best');
				} else {
					await setdata1(json1.data);
					console.log(data1);
					setCreds({
						name: json1.data.name,
						courseId: json1.data.courseId,
						batch: json1.data.batch,
						credits: json1.data.credits,
						seats: json1.data.seats,
						courseType: json1.data.courseType,
					});
					console.log(json.data);
					const prevfaclist = [];
					for (const fac in json.data) {
						let prevfac = json.data[fac]._id + '|' + json.data[fac].email + ' - ' + json.data[fac].name;
						json1.data.Faculty.forEach((value, key) => {
							if (value._id === json.data[fac]._id) {
								prevfaclist.push(prevfac);
							}
						});
					}
					console.log(prevfaclist);
					setFacultyList(prevfaclist);
				}
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		}
		authorize();
		fetchData();
	}, [location.state.courseid]);

	const handleSubmit = async e => {
		e.preventDefault();
		if (parseInt(creds.seats, 10) <= 0) {
			alert('Number of seats has to be positive!');
			return true;
		}

		if (parseInt(creds.credits, 10) < 0) {
			alert('Number of credits can not be negative!');
			return true;
		}
		if (facultyList.length === 0) {
			alert('Atleast 1 Faculty should be assigned!');
			return true;
		}
		const splitList = [];
		facultyList.forEach(fac => {
			splitList.push(fac.split('|')[0]);
		});
		creds.Faculty = splitList;
		creds.courseRId = location.state.courseid;
		const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/updatecourse`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(creds),
		});
		const json = await response.json();
		if (!json.success) {
			alert(json.errors);
		} else {
			navigate('/courseview', { state: { courseid: location.state.courseid } });
		}
	};

	return (
		<div id='form-container'>
			<form onSubmit={handleSubmit}>
				<div className='form-row'>
					<div className='weirdsettings'>
						<label htmlFor='name' style={{ fontSize: '20px' }}>
							Course Name&nbsp;&nbsp;:&nbsp;&nbsp;
						</label>
						<input type='text' id='name' name='name' onChange={handleChange} defaultValue={data1.name} />
					</div>
					<div className='weirdsettings'>
						<label htmlFor='courseId' style={{ fontSize: '20px' }}>
							Course ID&nbsp;&nbsp;:&nbsp;&nbsp;
						</label>
						<input type='text' id='courseId' name='courseId' onChange={handleChange} defaultValue={data1.courseId} />
					</div>
				</div>
				<div className='form-row'>
					<div className='weirdsettings'>
						<label htmlFor='batch' style={{ fontSize: '20px' }}>
							Batch&nbsp;&nbsp;:&nbsp;&nbsp;
						</label>
						<input type='text' id='batch' name='batch' onChange={handleChange} defaultValue={data1.batch} />
					</div>
					<div className='weirdsettings'>
						<label htmlFor='credits' style={{ fontSize: '20px' }}>
							Credits&nbsp;&nbsp;:&nbsp;&nbsp;
						</label>
						<input type='number' id='credits' name='credits' onChange={handleChange} defaultValue={data1.credits} />
					</div>
				</div>
				<div className='form-row'>
					<div className='weirdsettings'>
						<label htmlFor='seats' style={{ fontSize: '20px' }}>
							Seats&nbsp;&nbsp;:&nbsp;&nbsp;
						</label>
						<input type='number' id='seats' name='seats' onChange={handleChange} defaultValue={data1.seats} />
					</div>
				</div>
				<div className='form-roww'>
					<div className='weirdsettings'>
						<div className='wow' onChange={handleChange}>
							<label style={{ fontSize: '20px' }}>Course Type&nbsp;&nbsp;:&nbsp;&nbsp;</label>
							<label style={{ width: 'auto' }}>
								<input type='radio' name='courseType' value='Program Course' checked={creds.courseType === 'Program Course'} /> Program
								Course&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							</label>
							<label>
								<input type='radio' name='courseType' value='Program Elective 1' />
								Program Elective 1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							</label>
							<label style={{ width: 'auto' }}>
								<input type='radio' name='courseType' value='Program Elective 2' />
								Program Elective 2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							</label>
							<label style={{ width: 'auto' }}>
								<input type='radio' name='courseType' value='Program Elective 3' />
								Program Elective 3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							</label>
							<label style={{ width: 'auto' }}>
								<input type='radio' name='courseType' value='Other Elective 1' />
								Other Elective 1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							</label>
							<label style={{ width: 'auto' }}>
								<input type='radio' name='courseType' value='Other Elective 2' />
								Other Elective 2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							</label>
						</div>
					</div>
				</div>
				<div className='form-row'>
					<div className='weirdsettings'>
						<label htmlFor='faculty' style={{ fontSize: '20px' }}>
							Faculty&nbsp;&nbsp;:&nbsp;&nbsp;
						</label>
						<select id='faculty' name='faculty' value={selectedFaculty} onChange={handleFacultyChange} style={{ maxHeight: '200px' }}>
							<option value=''>Select Faculty</option>
							{data &&
								data.length > 0 &&
								data.map((faculty, index) => (
									<option key={index} value={`${faculty._id}|${faculty.email} - ${faculty.name}`}>
										{faculty.email} - {faculty.name}
									</option>
								))}
						</select>
						<button type='button' onClick={addFaculty} style={{ marginLeft: '10px' }}>
							Add
						</button>
					</div>
				</div>
				{/* Display selected faculty list */}
				<div style={{ textAlign: 'left', marginTop: '10px', marginLeft: '130px' }}>
					{facultyList.map((faculty, index) => (
						<div key={index} style={{ marginBottom: '5px' }}>
							<span>{faculty.split('|')[1]}</span>
							<button type='button' onClick={() => removeFaculty(faculty)} style={{ marginLeft: '10px' }}>
								Remove
							</button>
						</div>
					))}
				</div>
				<button type='submit' className='complete'>
					Save Changes
				</button>
			</form>
		</div>
	);
}
