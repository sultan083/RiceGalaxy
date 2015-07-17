<%inherit file="/base.mako"/>
<%namespace file="/message.mako" import="render_msg" />

%if message:
    ${render_msg( message, 'done' )}
%endif

<!--run_stats.mako-->
<html>
    <head> 
        <script type="text/javascript" src="/report/static/scripts/reports_webapp/run_stats.js"></script>
        <script type="text/javascript">
        $(document).ready( function(e) {
            create_chart( ${jf_hr_data}, "jf_hr_chart", "hours", "Jobs Finished per Hour" );
            create_chart( ${jf_dy_data}, "jf_dy_chart", "days", "Jobs Finished per Day" );
            create_chart( ${jc_hr_data}, "jc_hr_chart", "hours", "Jobs Created per Hour" );
            create_chart( ${jc_dy_data}, "jc_dy_chart", "days", "Jobs Created per Day" );
            create_histogram( ${et_hr_data}, "et_hr_chart", "delta-hours", "Job Run Times (past day)" );
            create_histogram( ${et_dy_data}, "et_dy_chart", "days", "Job Run Time (past 3 days)" );
        });
        </script>
    </head>

    <body>
        <div class="toolForm">
            <div class="charts">
                <div class="trim" id="tr_hr"></div>
                <div class="hr_container" >
                    <svg class="chart hr" id="jf_hr_chart"></svg>
                </div>
                <div class="hr_container">
                    <svg class="chart hr" id="jc_hr_chart"></svg>
                </div>
                <div class="hr_container">
                    <svg class="chart hr" id="et_hr_chart"></svg>
                </div>
                
            </div>
            <div class="charts">
                <div class="trim" id="tr_dy"></div>
                <div class="dy_container">
                    <svg class="chart dy" id="jf_dy_chart"></svg>
                </div>
                <div class="dy_container">
                    <svg class="chart dy" id="jc_dy_chart"></svg>
                </div>
                <div class="dy_container">
                    <svg class="chart dy" id="et_dy_chart"></svg>
                </div>
                
            </div>
        </div>
    </body>
</html>
<!--run_stats.mako-->