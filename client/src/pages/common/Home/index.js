import { Col, message, Row } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllExams } from "../../../apicalls/exams";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import PageTitle from "../../../components/PageTitle";
import { useNavigate } from "react-router-dom";

function Home() {
  const [exams, setExams] = React.useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const getExams = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams();
      if (response.success) {
        setExams(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getExams();
  }, []);

  const adminMessage = (
    <div className="welcome-message bg-blue-100 p-4 rounded-lg mb-4">
      <h2 className="text-xl font-bold">Welcome, Admin!</h2>
      <p>
        You have full control over the exam portal. Here, you can create,
        manage, and customize tests for users. Start by setting up new
        assessments and monitor the progress of test-takers. Your role is
        essential in shaping the exams and ensuring a reliable testing
        experience.
      </p>
    </div>
  );

  const userMessage = (
    <div className="welcome-message bg-green-100 p-4 rounded-lg mb-4">
      <h2 className="text-xl font-bold">Welcome, Student!</h2>
      <p>
        You're all set to begin your exams. Browse the available tests, track
        your progress, and challenge yourself to achieve your best scores. Good
        luck, and remember that each test is an opportunity to improve and
        learn!
      </p>
    </div>
  );

  return (
    user && (
      <div>
        <PageTitle
          title={
            user.isAdmin
              ? `Welcome Admin ${user.name}`
              : `Hi ${user.name}, Welcome to Quiz Application`
          }
        />
        <div className="divider"></div>
        {/* Display the welcome message */}
        {user.isAdmin ? adminMessage : userMessage}
        <Row gutter={[16, 16]}>
          {exams.map((exam) => (
            <Col span={6} key={exam._id}>
              <div className="card-lg flex flex-col gap-1 p-2 rounded-lg">
                <h1 className="text-2xl">{exam?.name}</h1>
                <h1 className="text-md">Category : {exam.category}</h1>
                <h1 className="text-md">Total Marks : {exam.totalMarks}</h1>
                <h1 className="text-md">Passing Marks : {exam.passingMarks}</h1>
                <h1 className="text-md">Duration : {exam.duration}</h1>
                {/* Only display the "Start Exam" button for users, not admins */}
                {!user.isAdmin && (
                  <button
                    className="primary-outlined-btn rounded-md"
                    onClick={async () => {
                      try {
                        const stream =
                          await navigator.mediaDevices.getUserMedia({
                            video: true,
                            audio: true,
                          });
                        stream.getTracks().forEach((track) => track.stop());
                        navigate(`/user/write-exam/${exam._id}`);
                      } catch (err) {
                        console.error("Error accessing media devices.", err);
                        message.error("Failed to access camera and microphone.");
                      }
                    }}
                  >
                    Start Exam
                  </button>
                )}
              </div>
            </Col>
          ))}
        </Row>
      </div>
    )
  );
}

export default Home;
