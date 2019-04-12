package com.siriuscom.ipl_scorer.bundle.beans;


public class DataBean {
	
	Object data;
	
	public Object getData() {
		return data;
	}
	public void setData(Object data) {
		this.data = data;
	}
	@Override
	public String toString() {
		return "{data=" + data + "}";
	}
	
	
}