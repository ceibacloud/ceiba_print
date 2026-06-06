/** @odoo-module **/

import { registry } from "@web/core/registry";
import { getReportUrl } from "@web/webclient/actions/reports/utils";

/**
 * Handle report actions by triggering a local print instead of downloading.
 */
async function ceibaLocalPrintHandler(action, options, env) {
    if (action.report_type === "qweb-pdf") {
        // We'll show a loading overlay while the report is being generated
        if (env.services.ui) {
            env.services.ui.block();
        }

        try {
            const url = getReportUrl(action, "pdf", env.userContext);
            
            // Create a hidden iframe to anchor the print action
            const iframe = document.createElement("iframe");
            iframe.style.position = "fixed";
            iframe.style.width = "0";
            iframe.style.height = "0";
            iframe.style.border = "none";
            iframe.style.zIndex = "-1";
            iframe.style.visibility = "hidden";
            iframe.src = url;
            
            document.body.appendChild(iframe);

            return new Promise((resolve) => {
                iframe.onload = () => {
                    // Slight delay to ensure PDF is loaded in the iframe context
                    setTimeout(() => {
                        try {
                            iframe.contentWindow.focus();
                            iframe.contentWindow.print();
                        } catch (e) {
                            console.error("Print failed, falling back to window opening or notification.", e);
                        }
                        
                        if (env.services.ui) {
                            env.services.ui.unblock();
                        }
                        
                        // Cleanup after a while (long enough for the print dialog to be handled)
                        setTimeout(() => {
                            if (iframe.parentNode) {
                                document.body.removeChild(iframe);
                            }
                        }, 30000); 
                        
                        resolve(true); 
                    }, 1000);
                };

                // Safety timeout in case PDF fails to load or iframe remains pending
                setTimeout(() => {
                    if (env.services.ui) {
                        env.services.ui.unblock();
                    }
                    resolve(true);
                }, 15000);
            });
        } catch (error) {
            if (env.services.ui) {
                env.services.ui.unblock();
            }
            console.error("Local print handler error:", error);
            // Returning false would allow the next handler (default download) to try
            return false; 
        }
    }
    return false;
}

// Add with high priority (lower sequence) to intercept all PDF reports
registry.category("ir.actions.report handlers").add("ceiba_local_print", ceibaLocalPrintHandler, { sequence: 1 });
