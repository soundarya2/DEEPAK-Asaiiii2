package com.siriuscom.ipl_scorer.bundle.processes;

import java.time.Instant;

import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.granite.workflow.WorkflowException;
import com.adobe.granite.workflow.WorkflowSession;
import com.adobe.granite.workflow.exec.WorkItem;
import com.adobe.granite.workflow.exec.WorkflowData;
import com.adobe.granite.workflow.exec.WorkflowProcess;
import com.adobe.granite.workflow.metadata.MetaDataMap;
import com.siriuscom.ipl_scorer.bundle.services.FirebaseHandler;
import com.siriuscom.ipl_scorer.bundle.services.MatchSchemaDataUpdate;

@Component(service=WorkflowProcess.class, property = {"process.label=Match Schema"})
public class MatchSchema implements WorkflowProcess{

private Logger log=LoggerFactory.getLogger(getClass());
	
	@Reference
	private ResourceResolverFactory resolverFactory;
	
	@Override
	public void execute(WorkItem workItem, WorkflowSession session, MetaDataMap map) throws WorkflowException {
		
		try {
			System.out.println("IN MY SCHEMA");
			System.out.println("match schem000>");
			
			long startmilli = System.currentTimeMillis();
			WorkflowData data = workItem.getWorkflowData();
			String payload = (String)data.getPayload(); 
			System.out.println(payload);
			Instant start = Instant.now();
			ResourceResolver resource=resolverFactory.getAdministrativeResourceResolver(null);
			FirebaseHandler handler=new FirebaseHandler();
			handler.postMatchSchemaData(resource, payload,start,startmilli);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	

}
