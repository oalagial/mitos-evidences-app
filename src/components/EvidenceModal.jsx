import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Modal,
  Typography,
} from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeEvidenceModal } from "../features/modal/modalSlice";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useQuery } from "react-query";

// This component renders a modal that displays detailed information about a selected character.
const EvidenceModal = () => {
  const dispatch = useDispatch();
  const evidence_id = useSelector((state) => state.modal.shownEvidence);
  const isEvidenceModalOpen = useSelector(
    (state) => state.modal.isEvidenceModalOpen
  );

  const {
    isLoading,
    error,
    data: evidence,
    refetch,
  } = useQuery(
    ["evidence", `${evidence_id}`],
    () => {
      let url = `http://localhost:3003/evidence/${evidence_id.evidence.id}`;
      return fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({ key1: "value1", key2: "value2" }), // set your body params here
      }).then((res) => {
        return res.json();
      });
    },
    {
      //This flag tells React Query to keep and display previous data while refetching in the background,
      // which reduces perceived latency and prevents UI flickers.
      keepPreviousData: true,
      enabled: !!evidence_id,
    }
  );

  const {
    isLoadingEvidence_in_services,
    // error,
    data: evidence_in_services,
    // refetch,
  } = useQuery(
    ["evidence_in_services", `${evidence_id}`],
    () => {
      let url = `http://localhost:3003/services_for_evidence/${evidence_id}`;

      return fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({ key1: "value1", key2: "value2" }), // set your body params here
      }).then((res) => {
        return res.json();
      });
    },
    {
      //This flag tells React Query to keep and display previous data while refetching in the background,
      // which reduces perceived latency and prevents UI flickers.
      keepPreviousData: true,
      enabled: !!evidence_id,
    }
  );

  return (
    <Modal
      open={isEvidenceModalOpen}
      onClose={() => {
        dispatch(closeEvidenceModal({}));
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <div>
          <h2>{evidence_id}</h2>
          {/* <h4>{evidence?.data.title.el}</h4> */}
          {evidence_in_services?.map((item, index) => (
            <div key={index}>
              {item.service_id} - {item.evidence_description}
            </div>
          ))}
          <Button
            variant="contained"
            onClick={() => {
              dispatch(closeEvidenceModal({}));
            }}
          >
            Return to list
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 10,
  textAlign: "center",
  maxHeight: "80vh",
  overflow: "scroll",
};

export default EvidenceModal;
