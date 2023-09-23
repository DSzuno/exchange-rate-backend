import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from "sinon";

chai.use(sinonChai);
chai.use(chaiAsPromised);

beforeEach(() => {
    global.sandbox = sinon.createSandbox();
})

afterEach(() => {
    global.sandbox.restore();
})
