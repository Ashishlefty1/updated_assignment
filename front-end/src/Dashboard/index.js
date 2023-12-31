import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import ajax from "../Services/fetchService";
import { Button, Card, Col, Row } from "react-bootstrap";
import StatusBadge from "../StatusBadge";
import { useUser } from "../UserProvider";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useUser();
  const [assignments, setAssignments] = useState(null);

  useEffect(() => {
    ajax("api/assignments", "GET", user.jwt).then((assignmentsData) => {
      setAssignments(assignmentsData);
    });
    if (!user.jwt) navigate("/login");
  }, [user.jwt]);

  function createAssignment() {
    ajax("api/assignments", "POST", user.jwt).then((assignment) => {
      navigate(`/assignments/${assignment.id}`);
      // window.location.href = `/assignments/${assignment.id}`;
    });
  }
  return (
    <div style={{ margin: "2em" }}>
      <Row>
        <Col>
          <div
            className="d-flex justify-content-end"
            style={{ cursor: "pointer" }}
            onClick={() => {
              user.setJwt(null);
              navigate("/login");
            }}
          >
            Logout
          </div>
        </Col>
      </Row>
      <div className="mb-4">
        <Button size="lg" onClick={() => createAssignment()}>
          Submit New Assignment
        </Button>
      </div>
      {assignments ? (
        <div
          className="d-grid gap-5"
          style={{ gridTemplateColumns: "repeat(auto-fill,18rem)" }}
        >
          {assignments.map((assignment) => (
            <Card
              key={assignment.id}
              style={{ width: "18rem", height: "18rem" , backgroundColor:"#b5e7a0" }}
              
            >
              <Card.Body className="d-flex flex-column justify-content-around">
                <Card.Title>Assignment #{assignment.number}</Card.Title>
                <div className="d-flex alignitems-start">
                  <StatusBadge text={assignment.status} />
                </div>

                <Card.Text style={{ marginTop: "1em" }}>
                  <b>Github URL:</b> {assignment.githuburl}
                  <br />
                  <b>Branch:</b> {assignment.branch}
                </Card.Text>

                <Button
                  variant="secondary"
                  onClick={() => {
                    window.location.href = `/assignments/${assignment.id}`;
                  }}
                >
                  Edit
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Dashboard;
