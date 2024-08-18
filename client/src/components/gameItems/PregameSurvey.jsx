import { useForm } from "@mantine/form";
import { TextInput, Button, Group } from "@mantine/core";

const PregameSurvey = () => {
  const preForm = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      age: 0,
      ethnicity: "",
      language: "",
      gender: "",
      education: "",
      employment: "",
      yearsOfExperience: 0,
      gameAmount: "",
      readingAmount: "",
      readMotivation: "",
      comparison: {
        poemWrite: 0,
        thinkNew: 0,
        critique: 0,
        gatherPaper: 0,
        researchTopic: 0,
        bestSolution: 0,
        newWays: 0,
      },
      ratings: {
        gameSkill: 0,
        isCompetitive: 0,
        newInfo: 0,
        linkThings: 0,
        connectDots: 0,
        noRisks: 0,
        excelIdentify: 0,
        betterWay: 0,
        spotOpportunity: 0,
        lookout: 0,
      },
    },
  });

  return (
    <>
      <div>
      </div>
    </>
  );
};

export default PregameSurvey;
