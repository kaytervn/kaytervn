/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package noti.thread;


import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 *
 * @author chuyennm
 */
public abstract class AbstractRunable implements Runnable {
    protected final  Logger LOG = LogManager.getLogger(getClass());

}
