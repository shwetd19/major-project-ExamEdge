import { Col, Row, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShowLoading, HideLoading } from "../../../redux/loaderSlice";
import PageTitle from "../../../components/PageTitle";
import { useNavigate, useParams } from "react-router-dom";
import { getPerformanceAnalysesByUserAndReport } from "../../../apicalls/performance.js";

function PerformanceAnalysis() {
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);

  const { userId, reportId } = useParams(); // Get userId and reportId from URL params

  const fetchPerformanceData = async () => {
    try {
      dispatch(ShowLoading());
      const payload = {
        user: userId, // Dynamic user ID from URL
        report: reportId, // Dynamic report ID from URL
      };

      // Fetch performance analysis by user and report
      const response = await getPerformanceAnalysesByUserAndReport(payload);

      if (response.success) {
        setPerformanceData(response.data[0]);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error("An error occurred while fetching the data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && reportId) {
      fetchPerformanceData();
    }
  }, [userId, reportId]);

  const adminMessage = (
    <div className="welcome-message bg-blue-100 p-4 rounded-lg mb-4">
      <h2 className="text-xl font-bold">Welcome, Admin!</h2>
      <p>You have control over the performance analysis system.</p>
    </div>
  );

  const userMessage = (
    <div className="welcome-message bg-green-100 p-4 rounded-lg mb-4">
      <h2 className="text-xl font-bold">Welcome, {user?.name}!</h2>
      <p>Here is your performance analysis.</p>
    </div>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    user && (
      <div>
        <PageTitle
          title={
            user.isAdmin
              ? `Welcome Admin ${user.name}`
              : `Hi ${user.name}, Your Performance Analysis`
          }
        />
        <div className="divider"></div>
        {/* Display the welcome message */}
        {user.isAdmin ? adminMessage : userMessage}

        {/* Display Performance Analysis */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <div className="card-lg p-4 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold">Performance Analysis</h2>
              <div className="mb-4">
                <h3 className="font-semibold">Summary</h3>
                <p>{performanceData?.analysis}</p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold">Strengths</h3>
                <ul>
                  <li>Answered the majority of questions correctly</li>
                  <li>Well-managed exam duration</li>
                  <li>Scored above passing marks</li>
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold">Weaknesses</h3>
                <ul>
                  <li>
                    One incorrect answer, indicating a small gap in
                    understanding
                  </li>
                  <li>Limited number of questions attempted</li>
                  <li>More detail needed on areas for improvement</li>
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold">Suggestions for Improvement</h3>
                <ul>
                  <li>Focus on understanding concepts thoroughly</li>
                  <li>Practice more to improve accuracy and speed</li>
                  <li>Attempt more questions for better overall performance</li>
                  <li>
                    Seek feedback from mentors to identify areas for improvement
                  </li>
                </ul>
              </div>

              <div className="text-sm text-gray-500">
                <p>
                  Analysis created on:{" "}
                  {new Date(performanceData.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    )
  );
}

export default PerformanceAnalysis;

// import { Col, Row, message } from "antd";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { ShowLoading, HideLoading } from "../../../redux/loaderSlice";
// import PageTitle from "../../../components/PageTitle";
// import { useNavigate } from "react-router-dom";
// import { generatePerformanceAnalysis, getPerformanceAnalysesByUserAndReport } from "../../../apicalls/performance.js";

// function PerformanceAnalysis() {
//   const [performanceData, setPerformanceData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user } = useSelector((state) => state.users);

//   const fetchPerformanceData = async () => {
//     try {
//       dispatch(ShowLoading());
//       const payload = {
//         user: "673c27113552cc04a08d1540", // Example user ID, replace with dynamic ID if needed
//         report: "673c36f263d98c07441e9e78", // Example report ID, replace with dynamic ID if needed
//       };

//       // Fetch performance analysis by user and report
//       const response = await getPerformanceAnalysesByUserAndReport(payload);

//       if (response.success) {
//         setPerformanceData(response.data[0]);
//       } else {
//         message.error(response.message);
//       }
//       dispatch(HideLoading());
//     } catch (error) {
//       dispatch(HideLoading());
//       message.error("An error occurred while fetching the data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPerformanceData();
//   }, []);

//   const adminMessage = (
//     <div className="welcome-message bg-blue-100 p-4 rounded-lg mb-4">
//       <h2 className="text-xl font-bold">Welcome, Admin!</h2>
//       <p>You have control over the performance analysis system.</p>
//     </div>
//   );

//   const userMessage = (
//     <div className="welcome-message bg-green-100 p-4 rounded-lg mb-4">
//       <h2 className="text-xl font-bold">Welcome, {user?.name}!</h2>
//       <p>Here is your performance analysis.</p>
//     </div>
//   );

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     user && (
//       <div>
//         <PageTitle
//           title={user.isAdmin ? `Welcome Admin ${user.name}` : `Hi ${user.name}, Your Performance Analysis`}
//         />
//         <div className="divider"></div>
//         {/* Display the welcome message */}
//         {user.isAdmin ? adminMessage : userMessage}

//         {/* Display Performance Analysis */}
//         <Row gutter={[16, 16]}>
//           <Col span={24}>
//             <div className="card-lg p-4 rounded-lg shadow-lg">
//               <h2 className="text-2xl font-bold">Performance Analysis</h2>
//               <div className="mb-4">
//                 <h3 className="font-semibold">Summary</h3>
//                 <p>{performanceData?.analysis}</p>
//               </div>

//               <div className="mb-4">
//                 <h3 className="font-semibold">Strengths</h3>
//                 <ul>
//                   <li>Answered the majority of questions correctly</li>
//                   <li>Well-managed exam duration</li>
//                   <li>Scored above passing marks</li>
//                 </ul>
//               </div>

//               <div className="mb-4">
//                 <h3 className="font-semibold">Weaknesses</h3>
//                 <ul>
//                   <li>One incorrect answer, indicating a small gap in understanding</li>
//                   <li>Limited number of questions attempted</li>
//                   <li>More detail needed on areas for improvement</li>
//                 </ul>
//               </div>

//               <div className="mb-4">
//                 <h3 className="font-semibold">Suggestions for Improvement</h3>
//                 <ul>
//                   <li>Focus on understanding concepts thoroughly</li>
//                   <li>Practice more to improve accuracy and speed</li>
//                   <li>Attempt more questions for better overall performance</li>
//                   <li>Seek feedback from mentors to identify areas for improvement</li>
//                 </ul>
//               </div>

//               <div className="text-sm text-gray-500">
//                 <p>Analysis created on: {new Date(performanceData.createdAt).toLocaleString()}</p>
//               </div>
//             </div>
//           </Col>
//         </Row>
//       </div>
//     )
//   );
// }

// export default PerformanceAnalysis;
