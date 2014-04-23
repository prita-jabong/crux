{include file="ui/Index/tpls/header.tpl"}
<head>
  <title>Upload :: Code.Me</title>
  <link rel="stylesheet" type="text/css" href="/ui/Upload/css/upload.css">
  <script type="text/javascript" src="/ui/Upload/js/upload.js"></script>
</head>
<body>
    <div id="wrapper">
        <div class="form-header-span">Upload Your Code</div>
        <form name="file-upload-form" id="file-upload-form" method="post" enctype="multipart/form-data">
        <div class="innerdiv">
            <input type="hidden" name="file-upload-action-name" id="file-upload-action-name" value="{$FILE_UPLOAD_ACTION_VALUE}">
            <div id="upload-msg-container">
                
            </div>
                 <div class="fieldset">   
                    <div>
                        <input class="uploadfile" name="uploadfile" type="file" />
                    </div>
                    <div>
                        <input type="text" name="program_title" id="program_id" placeholder="Write program title here..."/>
                    </div>
                    <div style="padding-bottom:15px;">
                        <span class="selectbox-div">
                             <select class="selectbox" name="language_id" id="language_id">
                            {foreach from=$LANGUAGE_LIST item=language}
                                <option value="{$language.id}">{$language.name}</option>
                            {/foreach}
                            </select>
                        </span>
                         <span class="selectbox-div">
                            <select class="selectbox" name="category_id" id="category_id">
                            {foreach from=$CATEGORY_LIST item=category}
                                <option value="{$category.id}">{$category.name}</option>
                            {/foreach}
                            </select>
                        </span>
                         <span class="selectbox-div">
                            <select class="selectbox" name="level" id="level">
                                <option value="Easy">Easy</option>
                                <option value="Average">Average</option>
                                <option value="Difficult">Difficult</option>
                            </select>
                        </span>
                    </div>
                    <div>
                        <textarea name="program_description" id="program_description" placeholder="Write description here..."></textarea>
                    </div>    
                    <input type="button" class="btns" value="Upload" onclick="upload('file-upload-form')">&nbsp;
                    <input type="checkbox" value="is_verified" name="is_verified" id="is_verified" ><label for="is_verified">Is Verified</label>
                </div> 
            </div>   
        </form>
    </div>
    {include file="ui/Index/tpls/footer.tpl"}
</body>
</html>