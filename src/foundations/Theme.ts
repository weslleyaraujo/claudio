import { Typography } from "./Typography";
import { Colors } from "./Colors";
import { Units, Scales } from "./Spacing";
import { Constants } from "./Constants";

export interface Theme {
  typography: Typography;
  colors: Colors;
  units: Units;
  scales: Scales;
  constants: Constants;
}
