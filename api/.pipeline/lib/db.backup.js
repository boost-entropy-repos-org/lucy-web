'use strict';
const util = require('util');
const child_process = require('child_process');
const pExec = util.promisify(child_process.exec);
const {OpenShiftClientX} = require('pipeline-cli')


const getConfig = (settings)  => {
    const phases = settings.phases
    const options= settings.options
    const phase = options.env
    const changeId = phases[phase].changeId
    return {
        env: options.env,
        options: options,
        changeId: changeId,
        namespace: phases[phase].namespace
    };
}

const getOC = (config) => {
    const oc= new OpenShiftClientX(Object.assign({'namespace': config.namespace}, config.options));
    return oc;
}

const getPOD = (oc) => {
    const allPods = oc.get('pods') || [];
    const pods = allPods.filter((pod) => {
        const meta = pod.metadata || {};
        const name = meta.name || '';
        return name.includes('invasivesbc-api-backup-dev-deploy');
    });
    if (pods.length > 0) {
        return {
            pod: pods[0],
            podName: pods[0].metadata.name
        }
    } else {
        return {}
    }
};

const execCmd = async (cmd, settings, tag = 'none') => {
    const config = getConfig(settings);
    const oc = getOC(config);
    const podDetails = getPOD(oc);
    if (podDetails.podName) {
        const backUpPod = podDetails.podName;
        try {
            const r = await pExec(`oc -n ${config.namespace} exec ${backUpPod} -c backup -- sh backup.sh ${cmd}`);
            console.log(`**** CMD [${tag} | ${cmd}] SUCCESSFUL *** \n\n`);
            console.log(r.stdout);
        } catch (error) {
            console.error(`*** Unable to run backup *** \n\n`);
            console.error(error);
            console.error('--------------------------------\n\n');
        }
        
    } else {
        console.error(`${tag} | ${cmd}: Unable to find backup pod`);
    }
};
module.exports = {
    backup: async (settings) => {
        await execCmd(`-1`, settings, 'backup');
    },
    listing: async (settings) => {
        await execCmd('-l', settings, 'listing');
    },
    restore: (settings) => {

    }
};