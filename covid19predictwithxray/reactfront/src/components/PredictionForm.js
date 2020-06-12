import React, { Component, Fragment } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { uploadImage } from "../actions/images";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import UploadImage from "./UploadImage";
import PredictProcess from "./PredictProcess";
import ResultCard from "./ResultCard";

const styles = (theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
});

export class PredictionForm extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    uploadImage: PropTypes.func.isRequired,
    prediction_res: PropTypes.number,
    upload_res: PropTypes.object.isRequired,
  };

  state = {
    activeStep: 0,
    file: {
      id: 0,
      name: "",
      score: 0,
    },
    fileUploaded: false,
    score: 0,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.upload_res != this.props.upload_res) {
      let file = {
        id: this.props.upload_res.id,
        name: this.props.upload_res.file,
        score: this.props.upload_res.score,
      };
      this.setState({ file: file });
      if (this.props.upload_res.file != "") {
        this.setState({
          fileUploaded: true,
        });
        this.handleNext();
      }
      if (this.props.prediction_res.name != "") {
        // this.handleNext();
      }
    }
  }

  getSteps = () => {
    return ["Select X-Ray Image", "Analyzing&Predicting", "Result"];
  };

  handleNext = () => {
    this.setState({ activeStep: this.state.activeStep + 1 });
  };

  handleBack = () => {
    this.setState({ activeStep: this.state.activeStep - 1 });
  };

  handleReset = () => {
    this.setState({ activeStep: 0 });
  };

  handleFileChange = (e) => {
    this.setState({ fileUploaded: false });
    let files = e.target.files;

    var formData = new FormData();
    formData.append("file", files[0]);
    this.props.uploadImage(formData);
  };

  handleScoreChange = (s) => {
    this.setState({ score: s });
  };
  render() {
    const main = {
      marginTop: "100px",
    };
    const { classes } = this.props;
    const { file, fileUploaded } = this.state;
    const values = { file, fileUploaded };
    const steps = this.getSteps();
    return (
      <Fragment>
        <div className="container">
          <div className="row"></div>
          <div className="row align-items-center" style={main}>
            <div className="col-sm-2 col-md-2"></div>
            <div className="col-sm-8 col-md-8">
              <div className={classes.root}>
                <Stepper
                  activeStep={this.state.activeStep}
                  orientation="vertical"
                >
                  <Step>
                    <StepLabel>Select X-Ray Image</StepLabel>
                    <StepContent>
                      <UploadImage
                        handleNext={this.handleNext}
                        handleFileChange={this.handleFileChange}
                        values={values}
                      />
                    </StepContent>
                  </Step>
                  <Step>
                    <StepLabel>Analyzing&Predicting</StepLabel>
                    <StepContent>
                      <PredictProcess
                        handleNext={this.handleNext}
                        handleBack={this.handleBack}
                        handleScoreChange={this.handleScoreChange}
                        values={values}
                      />
                    </StepContent>
                  </Step>
                </Stepper>
                {this.state.activeStep === steps.length && (
                  <Paper
                    square
                    elevation={0}
                    className={classes.resetContainer}
                  >
                    <Typography>
                      All steps completed - you&apos;re finished
                    </Typography>
                    <Button
                      onClick={this.handleReset}
                      className={classes.button}
                    >
                      Reset
                    </Button>
                  </Paper>
                )}
              </div>
            </div>
            <div className="col-sm-2 col-md-2"></div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  upload_res: state.images.upload_res,
  prediction_res: state.images.prediction_res,
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps, { uploadImage })
)(PredictionForm);

// withStyles(styles)(PredictionForm);
