import {NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { Resource} from "@opentelemetry/resources";


export const register = () => {

  const resource : any  = new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: "UserManagmentSERVICE",
    });
  const sdk = new NodeSDK({
      resource  ,
      traceExporter: new OTLPTraceExporter({ headers: {} }),
      instrumentations: [getNodeAutoInstrumentations()],
    });

  sdk.start()
  console.log("Registred with Jaeger")
}

