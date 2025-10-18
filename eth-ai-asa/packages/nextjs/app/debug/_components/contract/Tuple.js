"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tuple = void 0;
const react_1 = require("react");
const ContractInput_1 = require("./ContractInput");
const utilsContract_1 = require("./utilsContract");
const common_1 = require("~~/utils/scaffold-eth/common");
const Tuple = ({ abiTupleParameter, setParentForm, parentStateObjectKey }) => {
    const [form, setForm] = (0, react_1.useState)(() => (0, utilsContract_1.getInitialTupleFormState)(abiTupleParameter));
    (0, react_1.useEffect)(() => {
        const values = Object.values(form);
        const argsStruct = {};
        abiTupleParameter.components.forEach((component, componentIndex) => {
            argsStruct[component.name || `input_${componentIndex}_`] = values[componentIndex];
        });
        setParentForm(parentForm => ({ ...parentForm, [parentStateObjectKey]: JSON.stringify(argsStruct, common_1.replacer) }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(form, common_1.replacer)]);
    return (<div>
      <div tabIndex={0} className="collapse collapse-arrow bg-base-200 pl-4 py-1.5 border-2 border-secondary">
        <input type="checkbox" className="min-h-fit! peer"/>
        <div className="collapse-title after:top-3.5! p-0 min-h-fit! peer-checked:mb-2 text-primary-content/50">
          <p className="m-0 p-0 text-[1rem]">{abiTupleParameter.internalType}</p>
        </div>
        <div className="ml-3 flex-col space-y-4 border-secondary/80 border-l-2 pl-4 collapse-content">
          {abiTupleParameter?.components?.map((param, index) => {
            const key = (0, utilsContract_1.getFunctionInputKey)(abiTupleParameter.name || "tuple", param, index);
            return <ContractInput_1.ContractInput setForm={setForm} form={form} key={key} stateObjectKey={key} paramType={param}/>;
        })}
        </div>
      </div>
    </div>);
};
exports.Tuple = Tuple;
